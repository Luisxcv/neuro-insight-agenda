
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { appointmentService } from '@/services/api';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const doctors = [
    { id: 1, name: 'Dr. María González', specialty: 'Neurología' },
    { id: 2, name: 'Dr. Carlos Rodríguez', specialty: 'Neurocirugía' },
    { id: 3, name: 'Dra. Ana Martínez', specialty: 'Radiología' }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await appointmentService.getAllAppointments();
        if (response.success) {
          setAppointments(response.data);
        }
      } catch (error) {
        console.error('Error al cargar citas:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las citas",
          variant: "destructive"
        });
      }
    };

    loadAppointments();
  }, []);

  const handleScheduleAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    try {
      const doctor = doctors.find(d => d.id.toString() === selectedDoctor);
      const appointmentData = {
        date: selectedDate,
        time: selectedTime,
        doctorName: doctor?.name || '',
        doctorSpecialty: doctor?.specialty || '',
        patientName: 'Usuario' // Esto debería venir del contexto de usuario
      };

      const response = await appointmentService.createAppointment(appointmentData);
      
      if (response.success) {
        // Actualizar la lista de citas
        const updatedResponse = await appointmentService.getAllAppointments();
        if (updatedResponse.success) {
          setAppointments(updatedResponse.data);
        }

        toast({
          title: "Cita agendada",
          description: `Cita con ${doctor?.name} el ${selectedDate} a las ${selectedTime}`,
        });

        // Limpiar formulario
        setSelectedDate('');
        setSelectedTime('');
        setSelectedDoctor('');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo agendar la cita",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-blue-900">Gestión de Citas</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Schedule Appointment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Agendar Nueva Cita</span>
              </CardTitle>
              <CardDescription>
                Programa una consulta con un especialista
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Seleccionar Médico</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccionar médico...</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hora</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccionar hora...</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <Button 
                onClick={handleScheduleAppointment}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Agendar Cita
              </Button>
            </CardContent>
          </Card>

          {/* My Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Mis Citas</span>
              </CardTitle>
              <CardDescription>
                Historial de citas médicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tienes citas programadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-semibold">{appointment.doctor}</p>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.date}</p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === 'Pendiente' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
