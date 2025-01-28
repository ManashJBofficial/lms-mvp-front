import AdminNoticeBoard from "@/components/notices/AdminNoticeBoard";
import InstructorNoticeBoard from "@/components/notices/InstructorNoticeBoard";
import { getRole } from "@/lib/auth";

const NoticeBoard = () => {
  return (
    <div className="md:pl-[240px] pl-0 transition-[padding] duration-300">
      <div className="p-4 max-w-7xl mx-auto">
        {getRole() === 2 && <AdminNoticeBoard />}
        {getRole() === 3 && <InstructorNoticeBoard />}
      </div>
    </div>
  );
};

export default NoticeBoard;
