import { NodePayloadClass, type NodePayload } from "../Node/payload.svelte";

type HeadingNodePayloadConstructor = {
  id: string;
  value: string;
  level: number;
};

export interface HeadingNodePayload extends NodePayload {
  level: number;
}

export class HeadingNodePayloadClass extends NodePayloadClass {
  level: number;

  constructor({ id, value, level }: HeadingNodePayloadConstructor) {
    super({ id, value, type: "HeadingNode" });
    this.level = level;
  }

  json(): HeadingNodePayload {
    return {
      id: this.id,
      type: this.type,
      level: this.level,
      children: this.children.map((child) => child.json()),
      value: this.value,
    };
  }
}
