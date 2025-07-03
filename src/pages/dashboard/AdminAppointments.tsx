import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  User,
  Stethoscope
} from 'lucide-react';

interface Appointment {
  id: number;
  date: string;
  time: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'reschedule_requested';
  createdAt: string;
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
    fetchRescheduleRequests();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/appointments/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAppointments(data.data);
        }
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar las citas",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRescheduleRequests = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/appointments/reschedule-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Agregar las solicitudes de reprogramación a la lista
          setAppointments(prev => [...prev, ...data.data]);
        }
      }
    } catch (error) {
      console.error('Error al cargar solicitudes de reprogramación:', error);
    }
  };

  const handleApproveAppointment = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAppointments(appointments.filter(apt => apt.id !== id));
        toast({
          title: "Cita aprobada",
          description: "La cita ha sido aprobada exitosamente",
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo aprobar la cita",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive"
      });
    }
  };

  const handleRejectAppointment = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAppointments(appointments.filter(apt => apt.id !== id));
        toast({
          title: "Cita rechazada",
          description: "La cita ha sido rechazada",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "No se pudo rechazar la cita",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600">Pendiente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Aprobada</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-600">Cancelada</Badge>;
      case 'completed':
        return <Badge variant="default">Completada</Badge>;
      case 'reschedule_requested':
        return <Badge variant="outline" className="text-blue-600">Reprogramación Solicitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Citas</h2>
        <p className="text-muted-foreground">
          Administra citas pendientes y solicitudes de reprogramación
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter(apt => apt.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">
              Nuevas solicitudes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reprogramaciones</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter(apt => apt.status === 'reschedule_requested').length}</div>
            <p className="text-xs text-muted-foreground">
              Solicitudes de cambio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Citas para hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(apt => {
                const appointmentDate = new Date(apt.date);
                const today = new Date();
                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                return appointmentDate >= today && appointmentDate <= weekFromNow;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Próximos 7 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de citas pendientes y reprogramaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Citas y Solicitudes Pendientes</CardTitle>
          <CardDescription>
            {appointments.length} elementos esperando revisión
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando citas...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay citas o solicitudes pendientes</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Solicitada</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.patientEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.doctorSpecialty}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>{new Date(appointment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAppointment(appointment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detalles de la Cita</DialogTitle>
                              <DialogDescription>
                                Información completa de la cita médica
                              </DialogDescription>
                            </DialogHeader>
                            {selectedAppointment && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Paciente
                                    </h4>
                                    <div className="p-3 border rounded">
                                      <p className="font-medium">{selectedAppointment.patientName}</p>
                                      <p className="text-sm text-muted-foreground">{selectedAppointment.patientEmail}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <Stethoscope className="h-4 w-4" />
                                      Médico
                                    </h4>
                                    <div className="p-3 border rounded">
                                      <p className="font-medium">{selectedAppointment.doctorName}</p>
                                      <p className="text-sm text-muted-foreground">{selectedAppointment.doctorSpecialty}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      Fecha y Hora
                                    </h4>
                                    <div className="p-3 border rounded">
                                      <p className="font-medium">{selectedAppointment.date}</p>
                                      <p className="text-sm text-muted-foreground">{selectedAppointment.time}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Estado</h4>
                                    <div className="p-3 border rounded">
                                      {getStatusBadge(selectedAppointment.status)}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                  {selectedAppointment.status === 'pending' ? (
                                    <>
                                      <Button 
                                        onClick={() => {
                                          handleApproveAppointment(selectedAppointment.id);
                                          setSelectedAppointment(null);
                                        }}
                                        className="flex-1"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Aprobar Cita
                                      </Button>
                                      <Button 
                                        variant="destructive"
                                        onClick={() => {
                                          handleRejectAppointment(selectedAppointment.id);
                                          setSelectedAppointment(null);
                                        }}
                                        className="flex-1"
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Rechazar
                                      </Button>
                                    </>
                                  ) : selectedAppointment.status === 'reschedule_requested' ? (
                                    <>
                                      <Button 
                                        onClick={() => {
                                          handleApproveAppointment(selectedAppointment.id);
                                          setSelectedAppointment(null);
                                        }}
                                        className="flex-1"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Aprobar Reprogramación
                                      </Button>
                                      <Button 
                                        variant="destructive"
                                        onClick={() => {
                                          handleRejectAppointment(selectedAppointment.id);
                                          setSelectedAppointment(null);
                                        }}
                                        className="flex-1"
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Rechazar Reprogramación
                                      </Button>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {appointment.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveAppointment(appointment.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRejectAppointment(appointment.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        ) : appointment.status === 'reschedule_requested' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveAppointment(appointment.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRejectAppointment(appointment.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppointments;