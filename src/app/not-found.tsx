import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <Link href="/">홈으로</Link>
    </div>
  );
}
