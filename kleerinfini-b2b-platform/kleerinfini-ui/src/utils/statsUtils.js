export const calculateSimulatedViews = (createdAt) => {
    if (!createdAt) return "0";
    const start = new Date(createdAt);
    const now = new Date();
    const diffInMs = now - start;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 0;
    if (diffInDays === 1) return 93;
    return 93 + (diffInDays - 1) * 102;
};
