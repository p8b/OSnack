import { Design } from 'react-email-editor';

export class EmailTemplate {
   id?: number = 0;
   name?: string;
   subject?: string;
   tokenUrlPath?: string;
   locked?: boolean;
   serverVariables: ServerVariables[] = [];
   isDefaultTemplate: boolean = false;
   html?: string;
   design?: Design;

   //constructor(et?: EmailTemplate) {
   //   this.id = et?.id;
   //   this.name = et?.name;
   //   this.subject = et?.subject;
   //   this.tokenUrlPath = et?.tokenUrlPath;
   //   this.locked = et?.locked;
   //   this.serverVariables = et?.serverVariables || [];
   //   this.isDefaultTemplate = et?.isDefaultTemplate || false;
   //   this.html = et?.html;
   //   this.design = et?.design;
   //}
}
export class ServerVariables {
   id: number;
   enumValue: number;
   replacementValue: string;
   constructor(id: number, enumValue: number, replacementValue: string) {
      this.id = id;
      this.enumValue = enumValue;
      this.replacementValue = replacementValue;
   }
}
