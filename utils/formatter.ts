export const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString));
};

export const getConversationPreview = (conversation: string, maxLength = 200) =>
    conversation.length <= maxLength ? conversation : `${conversation.substring(0, maxLength)}...`;