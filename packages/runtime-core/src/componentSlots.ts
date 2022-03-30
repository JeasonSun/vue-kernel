import { ShapeFlags } from "@vue-kernel/shared";

export function initSlots(instance, children){
  if(instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN){
    // TODO: 处理slots
  }
}