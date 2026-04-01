'use client';

import { useState, useMemo } from 'react';
import { Player } from '@remotion/player';
import { ReelComposition, ReelCompositionProps } from '@/components/ReelComposition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Download } from 'lucide-react';

export default function Page() {
  const [scenes, setScenes] = useState<{ text: string; durationInSeconds: number }[]>([
    { text: 'Bem-vindo ao\nReel Generator!', durationInSeconds: 5 },
    { text: 'Crie vídeos incríveis\nem segundos.', durationInSeconds: 5 },
    { text: 'Compartilhe com\no mundo!', durationInSeconds: 5 },
  ]);

  const [bgColor, setBgColor] = useState('#1e1e2f');
  const [textColor, setTextColor] = useState('#ffffff');

  const fps = 30;
  const totalDurationInSeconds = useMemo(() => scenes.reduce((acc, scene) => acc + scene.durationInSeconds, 0), [scenes]);
  const durationInFrames = Math.max(1, Math.round(totalDurationInSeconds * fps));

  const handleAddScene = () => {
    setScenes([...scenes, { text: 'Nova cena', durationInSeconds: 5 }]);
  };

  const handleRemoveScene = (index: number) => {
    if (scenes.length > 1) {
      setScenes(scenes.filter((_, i) => i !== index));
    }
  };

  const handleSceneChange = (index: number, field: 'text' | 'durationInSeconds', value: string | number) => {
    const newScenes = [...scenes];
    newScenes[index] = { ...newScenes[index], [field]: value as never };
    setScenes(newScenes);
  };

  const inputProps: ReelCompositionProps = {
    scenes,
    bgColor,
    textColor,
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-100 overflow-hidden">
      {/* Sidebar Controls */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white shadow-xl z-10 flex flex-col h-full border-r">
        <div className="p-6 pb-4 border-b">
          <h1 className="text-2xl font-bold tracking-tight">Reel Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">Crie vídeos de 15s para Reels</p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Estilo</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bgColor">Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bgColor"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 font-mono text-sm uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textColor">Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 font-mono text-sm uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Cenas</h2>
                <span className="text-sm font-medium bg-neutral-100 px-2 py-1 rounded-md">
                  {totalDurationInSeconds.toFixed(1)}s total
                </span>
              </div>

              <div className="space-y-4">
                {scenes.map((scene, index) => (
                  <Card key={index} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium">Cena {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveScene(index)}
                        disabled={scenes.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Texto</Label>
                        <Textarea
                          value={scene.text}
                          onChange={(e) => handleSceneChange(index, 'text', e.target.value)}
                          className="resize-none h-20"
                          placeholder="Digite o texto da cena..."
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Duração (segundos)</Label>
                        <Input
                          type="number"
                          min={1}
                          max={15}
                          step={0.5}
                          value={scene.durationInSeconds}
                          onChange={(e) => handleSceneChange(index, 'durationInSeconds', parseFloat(e.target.value) || 1)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button onClick={handleAddScene} variant="outline" className="w-full" disabled={totalDurationInSeconds >= 15}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cena
              </Button>
              {totalDurationInSeconds > 15 && (
                <p className="text-xs text-destructive font-medium mt-2">
                  Aviso: O vídeo tem mais de 15 segundos. Reels geralmente têm 15s, 30s ou 60s.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-6 border-t bg-neutral-50">
          <Button className="w-full" size="lg" onClick={() => alert('Para exportar o vídeo, você precisa configurar o @remotion/renderer no servidor. Esta é uma demonstração do Player.')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Vídeo
          </Button>
        </div>
      </div>

      {/* Video Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-neutral-100 relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-[400px]">
          <div className="w-full bg-black rounded-3xl shadow-2xl overflow-hidden border-[8px] border-neutral-800 relative aspect-[9/16]">
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
              <div className="w-32 h-6 bg-neutral-800 rounded-b-xl" />
            </div>
            
            <Player
              component={ReelComposition as React.FC<any>}
              inputProps={inputProps}
              durationInFrames={durationInFrames}
              fps={fps}
              compositionWidth={1080}
              compositionHeight={1920}
              style={{
                width: '100%',
                height: '100%',
              }}
              controls
              loop
              autoPlay
            />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-neutral-500">Preview (1080x1920 @ 30fps)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
