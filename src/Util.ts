const PROCESS_TYPE: string[] = ["black","white"];
export const CheckProcessType = (param : string) :boolean => {
    
    return PROCESS_TYPE.includes(param);
}