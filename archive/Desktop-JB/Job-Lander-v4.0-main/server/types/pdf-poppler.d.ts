declare module 'pdf-poppler' {
  export interface ConvertOptions {
    format?: 'jpeg' | 'png';
    out_dir?: string;
    out_prefix?: string;
    page?: number;
    scale?: number;
    single_file?: boolean;
  }

  export interface Info {
    pages: number;
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
  }

  export function convert(file: string | Buffer, options?: ConvertOptions): Promise<string[]>;
  export function info(file: string | Buffer): Promise<Info>;
}