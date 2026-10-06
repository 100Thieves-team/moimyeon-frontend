export function getRoomStatusLabel(status: string) {
  switch (status) {
    case "RECRUITING":
      return "모집 중";
    case "CONFIRMED":
      return "진행 확정";
    case "COMPLETED":
      return "면접 완료";
    case "CANCELED":
      return "면접 취소";
    default:
      return "상태 확인 필요";
  }
}
