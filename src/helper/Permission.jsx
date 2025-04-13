const hasPermission = (permissions, module, action) => {
    return permissions.some(p => p.module === module && p.action === action);
};
export { hasPermission } 