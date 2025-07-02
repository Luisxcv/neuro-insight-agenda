import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/api";
import { CheckCircle, UserCheck, Mail, Calendar } from "lucide-react";

interface PendingDoctor {
  id: number;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt?: string;
}

const PendingDoctors = () => {
  const [doctors, setDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await userService.getPendingDoctors();
      setDoctors(response);
    } catch (error) {
      console.error('Error cargando médicos pendientes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los médicos pendientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const approveDoctor = async (id: number) => {
    try {
      await userService.approveDoctor(id);
      toast({
        title: "Éxito",
        description: "Médico aprobado exitosamente"
      });
      loadPendingDoctors(); // Recargar la lista
    } catch (error) {
      console.error('Error aprobando médico:', error);
      toast({
        title: "Error",
        description: "No se pudo aprobar el médico",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadPendingDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando médicos pendientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Médicos Pendientes</h1>
          <p className="text-muted-foreground">
            Gestiona las solicitudes de aprobación de médicos
          </p>
        </div>
        <Button 
          onClick={loadPendingDoctors}
          variant="outline"
          className="flex items-center gap-2"
        >
          <UserCheck className="h-4 w-4" />
          Actualizar Lista
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Solicitudes de Aprobación
          </CardTitle>
          <CardDescription>
            {doctors.length === 0 
              ? "No hay médicos pendientes de aprobación"
              : `${doctors.length} médico(s) esperando aprobación`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay médicos pendientes</h3>
              <p className="text-muted-foreground">
                Todos los médicos han sido procesados o no hay solicitudes nuevas.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Médico</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {doctor.role}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {doctor.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        Pendiente de Aprobación
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => approveDoctor(doctor.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
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

export default PendingDoctors;