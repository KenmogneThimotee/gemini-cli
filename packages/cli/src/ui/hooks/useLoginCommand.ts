/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useState } from 'react';
import { MessageType } from '../types.js';
import { UseHistoryManagerReturn } from './useHistoryManager.js';
import { useTextBuffer } from '../components/shared/text-buffer.js';
import { useStdin } from 'ink';

export const useLoginCommand = (
  addItem: UseHistoryManagerReturn['addItem'],
) => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [loginURL, setLoginURL] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { stdin, setRawMode } = useStdin();
  
  // Create a text buffer for token input
  const buffer = useTextBuffer({
    initialText: '',
    viewport: { height: 1, width: 40 },
    stdin,
    setRawMode,
    isValidPath: () => false,
  });

  const openLoginDialog = useCallback((url: string = 'https://example.com/login') => {
    setLoginURL(url);
    setLoginError(null);
    setSuccessMessage(null);
    setIsLoading(false);
    buffer.setText('');
    setIsLoginDialogOpen(true);
  }, [buffer]);

  const closeLoginDialog = useCallback(() => {
    setIsLoginDialogOpen(false);
    setLoginError(null);
    setSuccessMessage(null);
    setIsLoading(false);
    buffer.setText('');
  }, [buffer]);

  const handleTokenSubmit = useCallback(async (_token: string) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Simulate token validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success case
      setSuccessMessage('Successfully authenticated!');
      setIsLoading(false);
      
      // Add success message to history
      addItem({
        type: MessageType.INFO,
        text: '✓ Login successful! You are now authenticated.',
      }, Date.now());
      
      // Close dialog after a short delay
      setTimeout(() => {
        closeLoginDialog();
      }, 2000);
      
    } catch (error) {
      // Error case
      setLoginError('Invalid token. Please try again.');
      setIsLoading(false);
    }
  }, [addItem, closeLoginDialog]);

  return {
    isLoginDialogOpen,
    openLoginDialog,
    closeLoginDialog,
    handleTokenSubmit,
    loginURL,
    loginError,
    successMessage,
    isLoading,
    buffer,
  };
};