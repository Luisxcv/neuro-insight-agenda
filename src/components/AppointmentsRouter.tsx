import { useAuth } from '@/contexts/AuthContext';
import Appointments from '@/pages/Appointments';
import AdminAppointments from '@/pages/dashboard/AdminAppointments';
import DoctorPatients from '@/pages/dashboard/DoctorPatients';

const AppointmentsRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'patient':
      return <Appointments />;
    case 'admin':
      return <AdminAppointments />;
    case 'doctor':
      return <DoctorPatients />;
    default:
      return <div>Acceso no autorizado</div>;
  }
};

export default AppointmentsRouter;