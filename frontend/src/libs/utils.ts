export const truncateContent = (content: string, maxLength: number): string => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...'; // Adjust the ellipsis or add a 'Read more' link if needed
    }
    return content;
  };