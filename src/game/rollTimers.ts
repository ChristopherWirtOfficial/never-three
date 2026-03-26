/** Cooldown / stun timeouts started from roll resolution (clear on unmount & tap-speed upgrade reset). */
export const rollTimers = {
  cool: null as ReturnType<typeof setTimeout> | null,
  stun: null as ReturnType<typeof setTimeout> | null,
};

export function clearRollTimeouts(): void {
  if (rollTimers.cool) {
    clearTimeout(rollTimers.cool);
    rollTimers.cool = null;
  }
  if (rollTimers.stun) {
    clearTimeout(rollTimers.stun);
    rollTimers.stun = null;
  }
}
