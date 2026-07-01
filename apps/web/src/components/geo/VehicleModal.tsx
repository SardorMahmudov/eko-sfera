"use client";

import { Modal } from "antd";
import type { MockVehicle } from "@/lib/mock/vehicles";
import { fmtNumber } from "@/lib/format";
import { BRAND } from "@/theme/themeConfig";

function StatCell({ value, unit }: { value: React.ReactNode; unit?: string }) {
  return (
    <div
      style={{
        flex: 1,
        border: "1px solid #eee",
        borderRadius: 6,
        padding: "8px 6px",
        textAlign: "center",
        minWidth: 0,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2, wordBreak: "break-word" }}>{value}</div>
      {unit && <div style={{ fontSize: 11, color: "#8c8c8c" }}>{unit}</div>}
    </div>
  );
}

function SectionBar({ title }: { title: string }) {
  return (
    <div
      style={{
        background: "#f0f2f5",
        padding: "6px 10px",
        fontWeight: 600,
        fontSize: 13,
        borderRadius: 4,
        margin: "14px 0 10px",
      }}
    >
      {title}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.4 }}>
      <b>{label}</b>
      {value != null && <span> : {value}</span>}
    </div>
  );
}

export default function VehicleModal({
  vehicle,
  onClose,
}: {
  vehicle: MockVehicle | null;
  onClose: () => void;
}) {
  return (
    <Modal
      open={!!vehicle}
      onCancel={onClose}
      footer={null}
      width={520}
      title={vehicle ? `${vehicle.plate} - ${vehicle.model}` : ""}
      styles={{
        header: {
          background: BRAND.green,
          margin: 0,
          padding: "12px 16px",
          borderRadius: "8px 8px 0 0",
        },
        body: { paddingTop: 12 },
      }}
      className="veh-modal"
    >
      {vehicle && (
        <div>
          {/* Yuqori statistika */}
          <div style={{ display: "flex", gap: 6 }}>
            <StatCell value={vehicle.speed} unit="км/с" />
            <StatCell value={fmtNumber(vehicle.odometer)} unit="км" />
            <StatCell value={fmtNumber(vehicle.engineHours)} unit="с." />
            <StatCell value={`📡 ${vehicle.satellites}`} />
            <StatCell
              value={
                <span style={{ fontSize: 11 }}>
                  {vehicle.lat.toFixed(6)}
                  <br />
                  {vehicle.lng.toFixed(6)}
                </span>
              }
            />
          </div>

          {/* Ko'rsatkichlar ahamiyati */}
          <SectionBar title="Кўрсаткичлар аҳамияти" />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div style={{ width: "50%" }}>
              <Field label="Зажигание" value={vehicle.ignition ? "Ёқилган" : "Ўчирилган"} />
              <Field label="Напр питания" value={vehicle.ignition ? "Ёқилган" : "Ўчирилган"} />
            </div>
            <div style={{ width: "50%" }}>
              <Field label="Напр питания" value={`${vehicle.voltage} V`} />
            </div>
          </div>

          {/* Odatiy maydonlar */}
          <SectionBar title="Одатий майдонлар" />
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div style={{ width: "50%", paddingRight: 10 }}>
              <Field label={vehicle.device} value={vehicle.imei} />
              <Field label="ДатаПЕРЕ Установки" value={vehicle.installDate} />
              <Field label="Пломбы" value={vehicle.seals} />
              <Field label="Установщик" value={vehicle.installer} />
              <Field label={vehicle.notes[1]?.date} value={vehicle.notes[1]?.text} />
            </div>
            <div style={{ width: "50%" }}>
              <Field label="Гос№" value={vehicle.gosNumber} />
              <Field label="Организация" value={vehicle.org} />
              <Field label="Тип машины" value={vehicle.model} />
              <Field label={vehicle.notes[0]?.date} value={vehicle.notes[0]?.text} />
            </div>
          </div>

          {/* Haydovchilar */}
          <SectionBar title="Ҳайдовчилар" />
          <div style={{ fontSize: 13, fontWeight: 600 }}>{vehicle.driver}</div>
        </div>
      )}
    </Modal>
  );
}
