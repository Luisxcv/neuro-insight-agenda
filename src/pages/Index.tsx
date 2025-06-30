
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Shield, Calendar, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Análisis con IA",
      description: "Detección temprana de aneurismas cerebrales usando inteligencia artificial avanzada"
    },
    {
      icon: Shield,
      title: "Seguridad Médica",
      description: "Cumplimiento con estándares de seguridad y privacidad en datos médicos"
    },
    {
      icon: Calendar,
      title: "Gestión de Citas",
      description: "Sistema integrado para agendar consultas con especialistas"
    },
    {
      icon: Users,
      title: "Múltiples Usuarios",
      description: "Plataforma para pacientes, médicos y administradores"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-blue-900">AI-Neurysm</h1>
            </div>
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Detección Temprana de Aneurismas Cerebrales
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema inteligente que utiliza IA para analizar imágenes médicas y detectar 
            aneurismas cerebrales, facilitando el diagnóstico temprano y la atención médica oportuna.
          </p>
          <div className="space-x-4">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              Comenzar Análisis
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
            >
              Acceder al Sistema
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-blue-600 text-white border-none">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold mb-4">
                ¿Listo para comenzar?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Únete a nuestra plataforma y accede a tecnología de vanguardia 
                para el análisis de imágenes médicas cerebrales.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Crear Cuenta Gratuita
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
