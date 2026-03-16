import PhotoIdentify from '../components/PhotoIdentify/PhotoIdentify';
import { useNavigate } from 'react-router-dom';

export default function IdentifyPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* 
        The PhotoIdentify component handles its own internal states.
        onClose will navigate back to the previous page.
      */}
      <PhotoIdentify onClose={() => navigate(-1)} />
    </div>
  );
}
