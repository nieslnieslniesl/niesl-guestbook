import { Badge } from './Badge';

type Props = {
  title: string;
  content: string;
  imagePath?: string | null;
};

export function TextBlockCard({ title, content, imagePath }: Props) {
  return (
    <div className="rainbow-border sparkle">
      <div className="inner">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-xl font-extrabold">{title}</h3>
        </div>
        <p className="mt-2 leading-6 whitespace-pre-line">{content}</p>
        {imagePath && (
          <div className="mt-3">
            <img
              src={imagePath}
              alt={title}
              className="rounded-xl border-4 border-[#ffbde1] max-h-96 object-cover w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

