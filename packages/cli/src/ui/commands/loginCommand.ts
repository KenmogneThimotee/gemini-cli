/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommandKind, SlashCommand } from './types.js';

export const loginCommand: SlashCommand = {
  name: 'login',
  description: 'log in to the CLI',
  kind: CommandKind.BUILT_IN,
  action: async (_context) => ({
    type: 'dialog',
    dialog: 'login',
  }),
};
