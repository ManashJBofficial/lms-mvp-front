export interface Notice {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  User: {
    id: string;
    name: string;
  };
  views: number;
  viewCount?: number;
  responseCount?: number;
  isViewed?: boolean;
  replies: NoticeReply[];
  _count?: {
    NoticeView: number;
  };
  Response?: any[];
}

export interface NoticeReply {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}
