import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const PatientAnalysis = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulación de análisis
    setTimeout(() => {
      setAnalysisResults([
        {
          id: 1,
          fileName: "resonancia_magnetica_001.jpg",
          result: "normal",
          confidence: 95,
          findings: "No se detectaron anomalías significativas en el tejido cerebral.",
          date: new Date().toLocaleDateString()
        }
      ]);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Análisis de IA</h2>
        <p className="text-muted-foreground">
          Sube tus imágenes médicas para análisis automático con inteligencia artificial
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Imágenes
          </CardTitle>
          <CardDescription>
            Sube imágenes de resonancia magnética, tomografías o rayos X
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Seleccionar archivos</Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,.dcm"
              onChange={handleFileUpload}
              className="cursor-pointer"
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Archivos seleccionados:</Label>
              <div className="space-y-1">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="outline">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handleAnalyze} 
            disabled={uploadedFiles.length === 0 || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Iniciar Análisis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Resultados del Análisis
            </CardTitle>
            <CardDescription>
              Resultados generados por inteligencia artificial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResults.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{result.fileName}</h4>
                  <Badge 
                    variant={result.result === 'normal' ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {result.result === 'normal' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {result.result === 'normal' ? 'Normal' : 'Anomalía detectada'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Confianza del análisis:</Label>
                    <p className="font-medium">{result.confidence}%</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Hallazgos:</Label>
                    <p className="text-sm">{result.findings}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-muted-foreground">Fecha de análisis:</Label>
                    <p className="text-sm">{result.date}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <AlertCircle className="inline h-3 w-3 mr-1" />
                    Este análisis es preliminar. Consulta siempre con un médico especialista.
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Tipos de archivo soportados:</p>
              <p className="text-muted-foreground">JPEG, PNG, DICOM (.dcm)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Precisión del sistema:</p>
              <p className="text-muted-foreground">Nuestro sistema tiene una precisión del 94% en detección de anomalías neurológicas</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Importante:</p>
              <p className="text-muted-foreground">Los resultados no reemplazan el diagnóstico médico profesional</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientAnalysis;