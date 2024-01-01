import { NodePayloadClass, type NodePayload } from "../Node/payload.svelte";

type BlockNodePayloadConstructor = {
  id: string;
  value: string;
};

export interface BlockNodePayload extends NodePayload {}

export class BlockNodePayloadClass extends NodePayloadClass {
  constructor({ id, value }: BlockNodePayloadConstructor) {
    super({ id, value, type: "BlockNode" });
  }

  json(): BlockNodePayload {
    return {
      id: this.id,
      type: this.type,
      children: this.children.map((child) => child.json()),
    };
  }
}
