type Props = {
  params: {
    userId: string;
    eventId: string;
  };
};

export default function PublicBookPage({ params }: Props) {
  return (
    <div>
      <h1>Public book page</h1>
      <p>{params.userId}</p>
      <p>{params.eventId}</p>
    </div>
  );

}
