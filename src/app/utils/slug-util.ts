export function generateScpiSlug(scpiName: string, managerName: string): string {
  return `${scpiName}-${managerName}`;
}