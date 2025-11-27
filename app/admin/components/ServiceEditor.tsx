"user client";

import { ServiceItem } from "@/lib/server/siteData";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface ServiceConfig {
  services: Service[];
}

interface ServiceEditorProps {
  config: ServiceConfig;
  setConfig: React.Dispatch<React.SetStateAction<ServiceConfig>>;
}

export default function ServiceEditor({ config, setConfig }: ServiceEditorProps) {
  const add = () => {
    const newItem = {
      id: uuid(),
      icon: "✨",
      title: "บริการใหม่",
      description: "รายละเอียดบริการ",
    };

    setConfig({ ...config, services: [...config.services, newItem] });
  };

  const remove = (id: string) => {
    setConfig({
      ...config,
      services: config.services.filter((s) => s.id !== id),
    });
  };

  const update = (id: string, field: string, value: string) => {
    setConfig({
      ...config,
      services: config.services.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  };

  const [dialogOpen, setDialogOpen] = useState(false);
const [editItem, setEditItem] = useState<ServiceItem | null>(null);

  return (
    <div className="space-y-4">

      {config.services.map((s) => (
        <div
          key={s.id}
          className="p-4 border border-base-300 rounded-lg grid md:grid-cols-[80px,1fr,2fr,auto] gap-4"
        >
          <div>
            <label className="label">Icon</label>
            <input
              className="input input-bordered"
              value={s.icon}
              onChange={(e) => update(s.id, "icon", e.target.value)}
            />
          </div>

          <div>
            <label className="label">ชื่อบริการ</label>
            <input
              className="input input-bordered"
              value={s.title}
              onChange={(e) => update(s.id, "title", e.target.value)}
            />
          </div>

          <div>
            <label className="label">รายละเอียด</label>
            <textarea
              className="textarea textarea-bordered"
              rows={2}
              value={s.description}
              onChange={(e) => update(s.id, "description", e.target.value)}
            />
          </div>

          <div className="flex justify-end items-center">
            <button className="btn btn-error btn-sm" onClick={() => remove(s.id)}>
              ลบ
            </button>
          </div>
        </div>
      ))}

      <button
  className="btn btn-primary"
  onClick={() => {
    setEditItem({
      id: uuid(),
      icon: "✨",
      title: "",
      description: "",
    });
    setDialogOpen(true);
  }}
>
  + เพิ่มบริการ
</button>

    </div>
  );
}
