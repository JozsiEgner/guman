import type { EzoChannel, EzoCore, GumanSex } from './types.js';

/** Sex-specific channel names drawn from the Ézó tradition. */
const MALE_CHANNEL_NAMES = [
  'Root-Anchor',
  'Vital-Core',
  'Solar-Will',
  'Heart-Bridge',
  'Voice-Signal',
  'Third-Vision',
  'Crown-Source',
];

const FEMALE_CHANNEL_NAMES = [
  'Earth-Root',
  'Creative-Flow',
  'Solar-Radiance',
  'Heart-Expansion',
  'Expression-Wave',
  'Inner-Sight',
  'Source-Connection',
];

const CHANNEL_DIRECTIONS: EzoChannel['direction'][] = [
  'inward', 'bidirectional', 'outward',
  'bidirectional', 'outward', 'inward', 'bidirectional',
];

/** Starting energy flow per channel, descending from Root to Crown. */
const INITIAL_CHANNEL_FLOWS = [80, 75, 70, 65, 60, 55, 50] as const;

function makeChannel(
  id: string,
  name: string,
  direction: EzoChannel['direction'],
  energyFlow: number,
): EzoChannel {
  return { id, name, energyFlow, direction, active: true };
}

/** Create the seven Ézó energy channels for the given sex. */
export function createEzoChannels(sex: GumanSex): EzoChannel[] {
  const names = sex === 'male' ? MALE_CHANNEL_NAMES : FEMALE_CHANNEL_NAMES;
  return names.map((name, i) =>
    makeChannel(`ch-${i + 1}`, name, CHANNEL_DIRECTIONS[i], INITIAL_CHANNEL_FLOWS[i]),
  );
}

/** Return a new channel list with the named channel set to active. */
export function activateChannel(channels: EzoChannel[], channelId: string): EzoChannel[] {
  return channels.map(ch => (ch.id === channelId ? { ...ch, active: true } : ch));
}

/** Return a new channel list with the named channel set to inactive. */
export function deactivateChannel(channels: EzoChannel[], channelId: string): EzoChannel[] {
  return channels.map(ch => (ch.id === channelId ? { ...ch, active: false } : ch));
}

/**
 * Flow `amount` units of energy through a channel.
 * The channel's energyFlow is clamped to [0, 100].
 * The core's overall energyLevel is adjusted proportionally (10 % of the delta).
 * Has no effect if the channel does not exist or is inactive.
 */
export function flowEnergy(core: EzoCore, channelId: string, amount: number): EzoCore {
  const channel = core.channels.find(ch => ch.id === channelId);
  if (!channel || !channel.active) return core;

  const newFlow = Math.max(0, Math.min(100, channel.energyFlow + amount));
  const delta = newFlow - channel.energyFlow;
  const newEnergyLevel = Math.max(0, Math.min(100, core.energyLevel + delta * 0.1));

  return {
    ...core,
    energyLevel: newEnergyLevel,
    channels: core.channels.map(ch =>
      ch.id === channelId ? { ...ch, energyFlow: newFlow } : ch,
    ),
  };
}

/** Sum of energyFlow across all active channels. */
export function totalActiveEnergyFlow(channels: EzoChannel[]): number {
  return channels
    .filter(ch => ch.active)
    .reduce((sum, ch) => sum + ch.energyFlow, 0);
}
