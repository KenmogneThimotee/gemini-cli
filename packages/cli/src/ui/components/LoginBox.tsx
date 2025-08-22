/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Box, Text } from 'ink';
import { Colors } from '../colors.js';
import { useKeypress, Key } from '../hooks/useKeypress.js';
import { TextBuffer } from './shared/text-buffer.js';
import chalk from 'chalk';
import { cpSlice, cpLen } from '../utils/textUtils.js';
import stringWidth from 'string-width';

interface LoginBoxProps {
  loginURL: string;
  buffer: TextBuffer;
  onTokenSubmit: (token: string) => void;
  successMessage?: string;
  errorMessage?: string;
  isLoading?: boolean;
}

export const LoginBox: React.FC<LoginBoxProps> = ({
  loginURL,
  buffer,
  onTokenSubmit,
  successMessage,
  errorMessage,
  isLoading = false,
}) => {
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleInput = useCallback(
    (key: Key) => {
      if (!showTokenInput) {
        // When not showing token input, any key press shows the input
        if (key.name !== 'escape') {
          setShowTokenInput(true);
        }
        return;
      }

      // Handle escape to hide token input
      if (key.name === 'escape') {
        buffer.setText('');
        setShowTokenInput(false);
        return;
      }

      // Handle return/enter
      if (key.name === 'return') {
        const token = buffer.text.trim();
        if (token) {
          onTokenSubmit(token);
          buffer.setText('');
        }
        return;
      }

      // Handle ctrl+c to clear
      if (key.ctrl && key.name === 'c') {
        buffer.setText('');
        return;
      }

      // Let buffer handle other input
      buffer.handleInput(key);
    },
    [buffer, showTokenInput, onTokenSubmit]
  );

  useKeypress(handleInput, { isActive: true });

  // Render the token input field
  const renderTokenInput = () => {
    const inputWidth = 40;
    const text = buffer.text;
    const display = cpSlice(text, 0, inputWidth);
    const currentVisualWidth = stringWidth(display);
    let paddedDisplay = display;
    
    if (currentVisualWidth < inputWidth) {
      paddedDisplay = display + ' '.repeat(inputWidth - currentVisualWidth);
    }

    // Add cursor
    const cursorPos = cpLen(text);
    if (cursorPos < inputWidth) {
      const charToHighlight = paddedDisplay[cursorPos] || ' ';
      const highlighted = chalk.inverse(charToHighlight);
      paddedDisplay =
        cpSlice(paddedDisplay, 0, cursorPos) +
        highlighted +
        cpSlice(paddedDisplay, cursorPos + 1);
    }

    return <Text>{paddedDisplay}</Text>;
  };

  return (
    <Box
      borderStyle="round"
      borderColor={
        successMessage
          ? Colors.AccentGreen
          : errorMessage
          ? Colors.AccentRed
          : Colors.AccentBlue
      }
      flexDirection="column"
      padding={1}
      marginY={1}
      width="100%"
    >
      {/* Status Messages */}
      {successMessage && (
        <Box marginBottom={1}>
          <Text bold color={Colors.AccentGreen}>
            ✓ {successMessage}
          </Text>
        </Box>
      )}
      
      {errorMessage && (
        <Box marginBottom={1}>
          <Text bold color={Colors.AccentRed}>
            ✗ {errorMessage}
          </Text>
        </Box>
      )}

      {/* Login URL */}
      {!successMessage && (
        <>
          <Box marginBottom={1}>
            <Text bold color={Colors.AccentPurple}>
              To login, visit this URL:
            </Text>
          </Box>
          <Box flexDirection="row" marginBottom={1}>
            <Box width="35%">
              <Text bold color={Colors.LightBlue}>
                URL
              </Text>
            </Box>
            <Box>
              <Text>{loginURL}</Text>
            </Box>
          </Box>

          {/* Token Input Section */}
          <Box marginTop={1} flexDirection="column">
            <Box marginBottom={1}>
              <Text bold color={Colors.AccentPurple}>
                {showTokenInput
                  ? 'Enter your authentication token:'
                  : 'Press any key to enter token...'}
              </Text>
            </Box>

            {showTokenInput && (
              <Box flexDirection="row">
                <Box width="35%">
                  <Text bold color={Colors.LightBlue}>
                    Token
                  </Text>
                </Box>
                <Box
                  borderStyle="single"
                  borderColor={Colors.LightBlue}
                  paddingX={1}
                >
                  {isLoading ? (
                    <Text color={Colors.AccentGreen}>Verifying...</Text>
                  ) : (
                    renderTokenInput()
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Help text */}
          {showTokenInput && !isLoading && (
            <Box marginTop={1}>
              <Text color={Colors.Gray}>
                Press Enter to submit, Esc to cancel, Ctrl+C to clear
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
