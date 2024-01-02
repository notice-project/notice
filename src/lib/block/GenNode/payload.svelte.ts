import { NodePayloadClass, type NodePayload } from "../Node/payload.svelte";

type GenNodePayloadConstructor = {
  id: string;
  value: string;
};

export interface GenNodePayload extends NodePayload {}

export class GenNodePayloadClass extends NodePayloadClass {
  constructor({ id, value }: GenNodePayloadConstructor) {
    super({ id, value, type: "GenNode" });
  }

  json(): GenNodePayload {
    return {
      id: this.id,
      type: this.type,
      children: this.children.map((child) => child.json()),
      value: this.value,
    };
  }
}
