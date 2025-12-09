import { Badge } from './Badge';

type Props = {
  title: string;
  content: string;
};

export function TextBlockCard({ title, content }: Props) {
  return (
    <div className="rainbow-border sparkle">
      <div className="inner">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-xl font-extrabold">{title}</h3>
          <Badge color="green">Vastgezet door Admin</Badge>
        </div>
        <p className="mt-2 leading-6 whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}

