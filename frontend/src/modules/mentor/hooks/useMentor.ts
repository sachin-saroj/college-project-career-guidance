import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSession, sendMessage, getHistory, getSession } from '../api/mentor.api';
import { ChatPayload } from '../types/mentor.types';

export const useConversationHistory = () => {
  return useQuery({
    queryKey: ['aiHistory'],
    queryFn: getHistory,
  });
};

export const useConversation = (sessionId: string) => {
  return useQuery({
    queryKey: ['aiSession', sessionId],
    queryFn: () => getSession(sessionId),
    enabled: !!sessionId,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (initialMessage?: string) => createSession(initialMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiHistory'] });
    }
  });
};

export const useChat = (sessionId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChatPayload) => sendMessage(payload),
    onMutate: async (newMsg) => {
      await queryClient.cancelQueries({ queryKey: ['aiSession', sessionId] });

      const previousSession = queryClient.getQueryData(['aiSession', sessionId]);

      // Optimistically add user message
      queryClient.setQueryData(['aiSession', sessionId], (old: any) => {
        if (!old?.data?.session) return old;
        const messages = [...old.data.session.messages, {
          _id: 'temp-' + Date.now(),
          role: 'user',
          content: newMsg.message,
          timestamp: new Date().toISOString()
        }];
        
        return {
          ...old,
          data: {
            ...old.data,
            session: {
              ...old.data.session,
              messages
            }
          }
        };
      });

      return { previousSession };
    },
    onError: (err, newMsg, context) => {
      // Revert if error occurs, but we might want to show an error bubble instead.
      // For now, reverting to original state
      queryClient.setQueryData(['aiSession', sessionId], context?.previousSession);
    },
    onSuccess: (data) => {
      // Upon success, the backend should return the AI's response message.
      // We append it to the session data.
      queryClient.setQueryData(['aiSession', sessionId], (old: any) => {
        if (!old?.data?.session) return old;
        
        // Remove temp message and add real user msg + ai response if backend returns them,
        // or just append the AI response. Assuming backend returns just the AI message for simplicity,
        // we'll just invalidate to fetch real state, or we can carefully merge.
        // It's safer to invalidate to get true DB IDs.
      });
      queryClient.invalidateQueries({ queryKey: ['aiSession', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['aiHistory'] }); // update lastMessageAt
    }
  });
};
