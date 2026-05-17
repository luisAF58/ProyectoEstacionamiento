import { useState } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  channelId: string;
  readApiKey: string;
  onSave: (channelId: string, readApiKey: string) => void;
}

export function ChannelSettings({ channelId, readApiKey, onSave }: Props) {
  const [cid, setCid] = useState(channelId);
  const [key, setKey] = useState(readApiKey);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          ThingSpeak
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold">ThingSpeak channel</h4>
            <p className="text-xs text-muted-foreground">
              Dejar en blanco para para funcion aleatoria.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cid" className="text-xs">Channel ID</Label>
            <Input id="cid" value={cid} onChange={(e) => setCid(e.target.value)} placeholder="p.e. 1234567" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="key" className="text-xs">Read API key (optional)</Label>
            <Input id="key" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Para canales privados" />
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              onSave(cid.trim(), key.trim());
              setOpen(false);
            }}
          >
            Guardar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
