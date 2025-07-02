import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Users, 
  Search, 
  Eye, 
  Calendar, 
  FileText,
  Brain,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  nextAppointment?: string;
  status: 'active' | 'inactive';
  totalAnalyses: number;
  lastAnalysisResult: 'normal' | 'abnormal' | 'pending';
}

const DoctorPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Datos de ejemplo
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: 1,
        name: "Ana García",
        email: "ana.garcia@email.com",
        phone: "+1234567890",
        lastVisit: "2024-01-15",
        nextAppointment: "2024-02-15",
        status: 'active',
        totalAnalyses: 3,
        lastAnalysisResult: 'normal'
      },
      {
        id: 2,
        name: "Carlos Mendoza",
        email: "carlos.mendoza@email.com", 
        phone: "+1234567891",
        lastVisit: "2024-01-10",
        status: 'active',
        totalAnalyses: 5,
        lastAnalysisResult: 'abnormal'
      },
      {
        id: 3,
        name: "María López",
        email: "maria.lopez@email.com",
        phone: "+1234567892",
        lastVisit: "2024-01-05",
        nextAppointment: "2024-02-20",
        status: 'active',
        totalAnalyses: 2,
        lastAnalysisResult: 'pending'
      },
      {
        id: 4,
        name: "Pedro Ruiz",
        email: "pedro.ruiz@email.com",
        phone: "+1234567893",
        lastVisit: "2023-12-20",
        status: 'inactive',
        totalAnalyses: 1,
        lastAnalysisResult: 'normal'
      }
    ];
    setPatients(mockPatients);
    setFilteredPatients(mockPatients);
  }, []);

  // Filtrar pacientes
  useEffect(() => {
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default">Activo</Badge>
    ) : (
      <Badge variant="outline">Inactivo</Badge>
    );
  };

  const getAnalysisResultBadge = (result: string) => {
    switch (result) {
      case 'normal':
        return <Badge variant="default" className="bg-green-100 text-green-800">Normal</Badge>;
      case 'abnormal':
        return <Badge variant="destructive">Anomalía</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendiente</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mis Pacientes</h2>
        <p className="text-muted-foreground">
          Gestiona y revisa el historial de tus pacientes
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análisis Pendientes</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.lastAnalysisResult === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Próximas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {patients.filter(p => p.nextAppointment).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {filteredPatients.length} pacientes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead>Próxima Cita</TableHead>
                <TableHead>Último Análisis</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.nextAppointment || '-'}</TableCell>
                  <TableCell>{getAnalysisResultBadge(patient.lastAnalysisResult)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles del Paciente</DialogTitle>
                            <DialogDescription>
                              Información completa de {patient.name}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPatient && (
                            <div className="space-y-6">
                              {/* Información personal */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Información Personal</Label>
                                  <div className="space-y-2 p-3 border rounded">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      <span>{selectedPatient.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      <span>{selectedPatient.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      <span>{selectedPatient.phone}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>Estado y Estadísticas</Label>
                                  <div className="space-y-2 p-3 border rounded">
                                    <div className="flex justify-between">
                                      <span>Estado:</span>
                                      {getStatusBadge(selectedPatient.status)}
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total análisis:</span>
                                      <span>{selectedPatient.totalAnalyses}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Último resultado:</span>
                                      {getAnalysisResultBadge(selectedPatient.lastAnalysisResult)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Historial reciente */}
                              <div className="space-y-2">
                                <Label>Historial Reciente</Label>
                                <div className="space-y-2">
                                  <div className="p-3 border rounded">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Calendar className="h-4 w-4" />
                                      <span className="font-medium">Última visita: {selectedPatient.lastVisit}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Consulta de rutina. Se realizó análisis de imágenes neurológicas.
                                    </p>
                                  </div>
                                  
                                  {selectedPatient.nextAppointment && (
                                    <div className="p-3 border rounded bg-blue-50">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium text-blue-600">
                                          Próxima cita: {selectedPatient.nextAppointment}
                                        </span>
                                      </div>
                                      <p className="text-sm text-blue-600">
                                        Seguimiento de análisis previo.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Acciones rápidas */}
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Agendar Cita
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver Historial
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Brain className="h-4 w-4 mr-2" />
                                  Nuevo Análisis
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorPatients;