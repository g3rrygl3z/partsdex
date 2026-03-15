{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 .AppleSystemUIFontMonospaced-Regular;}
{\colortbl;\red255\green255\blue255;\red19\green19\blue21;\red241\green241\blue242;}
{\*\expandedcolortbl;;\cssrgb\c9412\c9412\c10588;\cssrgb\c95686\c95686\c96078;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 ```python\
"""\
OpenRouter Models MCP Server -- Hunter Alpha and Healer Alpha as Claude Code tools.\
\
Tools:\
  - ask_hunter: 1T param reasoning model, 1M context window\
  - ask_healer: omni-modal reasoning model, 256K context window\
  - compare_models: same prompt to both in parallel, side-by-side\
  - ask_with_file: send a file + prompt to either model\
"""\
\
import json, sys, os, concurrent.futures, requests\
\
API_KEY = os.environ.get("OPENROUTER_API_KEY", "")\
API_URL = "https://openrouter.ai/api/v1/chat/completions"\
\
MODELS = \{\
    "hunter": \{"id": "openrouter/hunter-alpha", "name": "Hunter Alpha"\},\
    "healer": \{"id": "openrouter/healer-alpha", "name": "Healer Alpha"\},\
\}\
\
\
def call_model(model_key, prompt, system=None, max_tokens=8192):\
    model = MODELS[model_key]\
    messages = [\
        \{"role": "system", "content": system or f"You are \{model['name']\}, a helpful AI assistant. Be direct and thorough."\},\
        \{"role": "user", "content": prompt\},\
    ]\
    resp = requests.post(\
        API_URL,\
        headers=\{"Authorization": f"Bearer \{API_KEY\}", "Content-Type": "application/json"\},\
        json=\{"model": model["id"], "messages": messages, "max_tokens": max_tokens, "temperature": 0.7\},\
        timeout=300,\
    )\
    data = resp.json()\
    if "choices" in data:\
        usage = data.get("usage", \{\})\
        t_in = usage.get("prompt_tokens", 0)\
        t_out = usage.get("completion_tokens", 0)\
        t_reason = usage.get("completion_tokens_details", \{\}).get("reasoning_tokens", 0)\
        text = data["choices"][0]["message"]["content"]\
        meta = f"[\{model['name']\}: \{t_in\} in / \{t_out\} out / \{t_reason\} reasoning]"\
        return text, meta\
    elif "error" in data:\
        return f"Error: \{data['error']\}", "[error]"\
    else:\
        return f"Unexpected response: \{json.dumps(data)[:500]\}", "[error]"\
\
\
# --- MCP Protocol (JSON-RPC over stdio) ---\
\
def send_response(id, result):\
    msg = json.dumps(\{"jsonrpc": "2.0", "id": id, "result": result\})\
    sys.stdout.write(f"Content-Length: \{len(msg.encode())\}\\r\\n\\r\\n\{msg\}")\
    sys.stdout.flush()\
\
def send_error(id, code, message):\
    msg = json.dumps(\{"jsonrpc": "2.0", "id": id, "error": \{"code": code, "message": message\}\})\
    sys.stdout.write(f"Content-Length: \{len(msg.encode())\}\\r\\n\\r\\n\{msg\}")\
    sys.stdout.flush()\
\
TOOLS = [\
    \{\
        "name": "ask_hunter",\
        "description": "Send a prompt to Hunter Alpha (1T params, 1M token context, reasoning model, free). Great for deep analysis, brainstorming, summarization, or tasks needing massive context.",\
        "inputSchema": \{\
            "type": "object",\
            "properties": \{\
                "prompt": \{"type": "string", "description": "Your question or task for Hunter Alpha"\},\
                "system": \{"type": "string", "description": "Optional custom system prompt"\},\
            \},\
            "required": ["prompt"],\
        \},\
    \},\
    \{\
        "name": "ask_healer",\
        "description": "Send a prompt to Healer Alpha (omni-modal, 256K token context, reasoning model, free). Good for creative tasks, alternative perspectives, and multi-modal analysis.",\
        "inputSchema": \{\
            "type": "object",\
            "properties": \{\
                "prompt": \{"type": "string", "description": "Your question or task for Healer Alpha"\},\
                "system": \{"type": "string", "description": "Optional custom system prompt"\},\
            \},\
            "required": ["prompt"],\
        \},\
    \},\
    \{\
        "name": "compare_models",\
        "description": "Send the same prompt to Hunter Alpha and Healer Alpha in parallel. Returns both responses side by side for comparison.",\
        "inputSchema": \{\
            "type": "object",\
            "properties": \{\
                "prompt": \{"type": "string", "description": "The prompt to send to both models"\},\
                "system": \{"type": "string", "description": "Optional custom system prompt for both"\},\
            \},\
            "required": ["prompt"],\
        \},\
    \},\
    \{\
        "name": "ask_with_file",\
        "description": "Send a prompt + file contents to Hunter or Healer for analysis. Use hunter for large files (1M context) or healer for creative/multi-modal analysis.",\
        "inputSchema": \{\
            "type": "object",\
            "properties": \{\
                "prompt": \{"type": "string", "description": "Your question about the file"\},\
                "file_content": \{"type": "string", "description": "The file contents to analyze"\},\
                "file_name": \{"type": "string", "description": "Name of the file (for context)"\},\
                "model": \{"type": "string", "enum": ["hunter", "healer"], "description": "Which model to use (default: hunter)"\},\
            \},\
            "required": ["prompt", "file_content"],\
        \},\
    \},\
]\
\
\
def handle_request(req):\
    method = req.get("method", "")\
    id = req.get("id")\
    params = req.get("params", \{\})\
\
    if method == "initialize":\
        send_response(id, \{\
            "protocolVersion": "2024-11-05",\
            "capabilities": \{"tools": \{\}\},\
            "serverInfo": \{"name": "openrouter-models", "version": "1.1.0"\},\
        \})\
    elif method == "notifications/initialized":\
        pass\
    elif method == "tools/list":\
        send_response(id, \{"tools": TOOLS\})\
    elif method == "tools/call":\
        name = params.get("name", "")\
        args = params.get("arguments", \{\})\
\
        if name == "ask_hunter":\
            text, meta = call_model("hunter", args["prompt"], system=args.get("system"))\
            send_response(id, \{"content": [\{"type": "text", "text": f"\{text\}\\n\\n---\\n\{meta\}"\}]\})\
\
        elif name == "ask_healer":\
            text, meta = call_model("healer", args["prompt"], system=args.get("system"))\
            send_response(id, \{"content": [\{"type": "text", "text": f"\{text\}\\n\\n---\\n\{meta\}"\}]\})\
\
        elif name == "compare_models":\
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:\
                f1 = pool.submit(call_model, "hunter", args["prompt"], args.get("system"))\
                f2 = pool.submit(call_model, "healer", args["prompt"], args.get("system"))\
                r1_text, r1_meta = f1.result()\
                r2_text, r2_meta = f2.result()\
            result = f"## Hunter Alpha\\n\\n\{r1_text\}\\n\\n\{r1_meta\}\\n\\n---\\n\\n## Healer Alpha\\n\\n\{r2_text\}\\n\\n\{r2_meta\}"\
            send_response(id, \{"content": [\{"type": "text", "text": result\}]\})\
\
        elif name == "ask_with_file":\
            model_key = args.get("model", "hunter")\
            if model_key not in MODELS:\
                model_key = "hunter"\
            file_name = args.get("file_name", "file")\
            full_prompt = f"\{args['prompt']\}\\n\\n--- \{file_name\} ---\\n\{args.get('file_content', '')\}"\
            text, meta = call_model(model_key, full_prompt)\
            send_response(id, \{"content": [\{"type": "text", "text": f"\{text\}\\n\\n---\\n\{meta\}"\}]\})\
\
        else:\
            send_error(id, -32601, f"Unknown tool: \{name\}")\
\
    elif method == "ping":\
        send_response(id, \{\})\
    else:\
        if id is not None:\
            send_error(id, -32601, f"Method not found: \{method\}")\
\
\
def main():\
    buf = b""\
    while True:\
        chunk = sys.stdin.buffer.read(1)\
        if not chunk:\
            break\
        buf += chunk\
        while b"\\r\\n\\r\\n" in buf:\
            header_end = buf.index(b"\\r\\n\\r\\n")\
            header = buf[:header_end].decode()\
            content_length = 0\
            for line in header.split("\\r\\n"):\
                if line.lower().startswith("content-length:"):\
                    content_length = int(line.split(":")[1].strip())\
            total_needed = header_end + 4 + content_length\
            if len(buf) < total_needed:\
                break\
            body = buf[header_end + 4 : total_needed].decode()\
            buf = buf[total_needed:]\
            try:\
                handle_request(json.loads(body))\
            except json.JSONDecodeError:\
                pass\
\
\
if __name__ == "__main__":\
    main()\
```\
\
### 3. Install Python dependencies\
\
```bash\
pip install requests python-dotenv\
```\
\
Or if you use a virtual environment:\
\
```bash\
python3 -m venv .venv\
.venv/bin/pip install requests python-dotenv\
```\
\
### 4. Add your API key\
\
Create a `.env` file in the same folder as `hunter_mcp.py`:\
\
```\
OPENROUTER_API_KEY=sk-or-v1-your-key-here\
```\
\
### 5. Wire it into Claude Code\
\
Add this to your project's `.mcp.json` file (create it in your project root if it doesn't exist):\
\
```json\
\{\
  "mcpServers": \{\
    "hunter": \{\
      "command": "python3",\
      "args": ["hunter_mcp.py"],\
      "env": \{\
        "OPENROUTER_API_KEY": "
\f1\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
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
\f0\fs24 \cf0 \cb1 \kerning1\expnd0\expndtw0 "\
      \}\
    \}\
  \}\
\}\
```\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
}