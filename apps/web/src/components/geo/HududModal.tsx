"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Modal, Form, Input, InputNumber, Row, Col, Button, Tooltip, Spin, App } from "antd";
import { EditOutlined, ClearOutlined, UndoOutlined } from "@ant-design/icons";

import type { GeoPolygon, MahallaAreaRow } from "@/lib/mock/geography";

const DrawableMap = dynamic(() => import("@/components/geo/DrawableMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Spin />
    </div>
  ),
});

interface FormValues {
  name: string;
  monthlyTrips: number;
  minMoveTime: number;
  minStops: number;
  maxAvgSpeed: number;
  minDistance: number;
}

interface Props {
  open: boolean;
  mahalla: string;
  existing: GeoPolygon[];
  // tahrirlanayotgan hudud (null → yangi qo'shish)
  initial?: MahallaAreaRow | null;
  onClose: () => void;
  onSubmit: (row: Omit<MahallaAreaRow, "id">) => void;
}

export default function HududModal({ open, mahalla, existing, initial, onClose, onSubmit }: Props) {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [drawing, setDrawing] = useState(true);
  const [draft, setDraft] = useState<[number, number][]>([]);
  const isEdit = !!initial;

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        name: initial.name,
        monthlyTrips: initial.monthlyTrips,
        minMoveTime: initial.minMoveTime ?? 0,
        minStops: initial.minStops ?? initial.minCount,
        maxAvgSpeed: initial.maxAvgSpeed ?? 0,
        minDistance: initial.minDistance ?? 0,
      });
      setDraft(initial.positions);
      setDrawing(false);
    } else {
      form.resetFields();
      setDraft([]);
      setDrawing(true);
    }
  }, [open, initial, form]);

  // tahrirlashda joriy hududni fon polygonlaridan chiqarib tashlaymiz
  const backdrop = initial ? existing.filter((p) => p.id !== initial.id) : existing;

  const addPoint = (p: [number, number]) => setDraft((d) => [...d, p]);
  const undo = () => setDraft((d) => d.slice(0, -1));
  const clear = () => setDraft([]);

  const submit = async () => {
    try {
      const v = await form.validateFields();
      if (draft.length < 3) {
        message.warning("Хаританинг устида ҳудуд чегарасини чизинг (камида 3 нуқта)");
        return;
      }
      onSubmit({
        name: v.name,
        monthlyTrips: v.monthlyTrips,
        minCount: v.minStops,
        minMoveTime: v.minMoveTime,
        minStops: v.minStops,
        maxAvgSpeed: v.maxAvgSpeed,
        minDistance: v.minDistance,
        positions: draft,
      });
      message.success(isEdit ? "Ҳудуд таҳрирланди" : "Ҳудуд қўшилди");
      onClose();
    } catch {
      /* validatsiya xatosi — antd o'zi ko'rsatadi */
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={submit}
      okText="Сақлаш"
      cancelText="Бекор қилиш"
      title={isEdit ? "Ҳудудни таҳрирлаш" : "Худуд қўшиш"}
      width={1080}
      styles={{ header: { background: "#00c950", margin: -20, marginBottom: 16, padding: "12px 20px" } }}
      className="hudud-modal"
    >
      <Form form={form} layout="vertical" requiredMark>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Ҳудуд номи" name="name" rules={[{ required: true, message: "Тўлдиринг" }]}>
              <Input placeholder="Масалан: 3-худуд" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Маҳалла номи" required>
              <Input value={mahalla} disabled />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ойлик қатновлар сони" name="monthlyTrips" rules={[{ required: true, message: "Тўлдиринг" }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Минимум ҳаракат вақти (минут)" name="minMoveTime" rules={[{ required: true, message: "Тўлдиринг" }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Минимум тўхташлар сони" name="minStops" rules={[{ required: true, message: "Тўлдиринг" }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Максимум ўртача тезлик (км/соат)" name="maxAvgSpeed" rules={[{ required: true, message: "Тўлдиринг" }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Ўтилиши керак бўлган минимум масофа (км)" name="minDistance" rules={[{ required: true, message: "Тўлдиринг" }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div style={{ position: "relative", height: 340, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.1)" }}>
        <DrawableMap existing={backdrop} draft={draft} drawing={drawing} onAddPoint={addPoint} />

        {/* Чизиш асбоблари (screenshotdagi қалам/ўчиргич) */}
        <div style={{ position: "absolute", top: 78, right: 10, zIndex: 1000, display: "flex", flexDirection: "column", gap: 6 }}>
          <Tooltip title={drawing ? "Чизиш ёқилган" : "Чизиш"} placement="left">
            <Button
              type={drawing ? "primary" : "default"}
              icon={<EditOutlined />}
              onClick={() => setDrawing((d) => !d)}
            />
          </Tooltip>
          <Tooltip title="Охирги нуқтани бекор қилиш" placement="left">
            <Button icon={<UndoOutlined />} onClick={undo} disabled={!draft.length} />
          </Tooltip>
          <Tooltip title="Тозалаш" placement="left">
            <Button icon={<ClearOutlined />} onClick={clear} disabled={!draft.length} />
          </Tooltip>
        </div>
      </div>
      <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>
        Хаританинг устига босиб ҳудуд чегарасини чизинг. Нуқталар сони: {draft.length}
      </div>
    </Modal>
  );
}
