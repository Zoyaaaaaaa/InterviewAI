export type Record = {
  id: string;
  user_id: string;
  document_id: string;
  document_url: string;
  document_name: string;
  created_at: Date;
};

export type Chat = {
  id: string;
  user_id: string;
  record_id: string;
  messages: any[];
  created_at: Date;
  updated_at: Date;
};
