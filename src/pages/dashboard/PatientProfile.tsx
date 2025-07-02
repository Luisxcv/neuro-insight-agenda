import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Calendar, Edit, Save, X } from 'lucide-react';

const PatientProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Aquí iría la llamada a la API para actualizar el perfil
    toast({
      title: "Perfil actualizado",
      description: "Tus datos han sido actualizados correctamente",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Tu información básica de perfil
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Guardar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{profileData.phone || 'No especificado'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo de cuenta</Label>
              <div className="flex items-center gap-2 p-2">
                <Badge variant="default">Paciente</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de la Cuenta</CardTitle>
          <CardDescription>
            Información sobre el estado y configuración de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Estado de la cuenta</p>
                <p className="text-sm text-muted-foreground">Tu cuenta está activa</p>
              </div>
              <Badge variant="default">Activa</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">Fecha de registro</p>
                <p className="text-sm text-muted-foreground">Miembro desde</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Enero 2024</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Médico</CardTitle>
          <CardDescription>
            Información rápida sobre tu historial médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-primary">5</div>
              <p className="text-sm text-muted-foreground">Análisis realizados</p>
            </div>
            
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">3</div>
              <p className="text-sm text-muted-foreground">Citas completadas</p>
            </div>
            
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <p className="text-sm text-muted-foreground">Citas pendientes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfile;