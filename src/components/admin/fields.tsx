import { errorText, hint, input, label } from "@/lib/ui";

export function Field({
  id,
  label: text,
  error,
  help,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  help?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid content-start gap-2 ${className}`}>
      <label htmlFor={id} className={label}>{text}</label>
      {children}
      {help && !error && <span className={hint}>{help}</span>}
      {error && <span className={errorText}>{error}</span>}
    </div>
  );
}

export const inputClass = input;

/** Upload de uma imagem: mostra a atual, permite trocar ou remover. */
export function ImageInput({
  label: text,
  fileName,
  currentName,
  removeName,
  current,
  allowSvg = false,
  help,
  error,
}: {
  label: string;
  fileName: string;
  currentName: string;
  removeName: string;
  current: string | null | undefined;
  allowSvg?: boolean;
  help?: string;
  error?: string;
}) {
  const accept = allowSvg ? "image/jpeg,image/png,image/webp,image/avif,image/svg+xml" : "image/jpeg,image/png,image/webp,image/avif";
  return (
    <div className="grid gap-3">
      <span className={label}>{text}</span>
      <div className="flex flex-wrap items-center gap-4">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element -- prévia de upload do Storage
          <img src={current} alt="" className="h-24 w-24 rounded-[10px] border border-line bg-olive object-contain p-1" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-[10px] border border-dashed border-line text-center text-xs text-muted">
            Sem imagem
          </div>
        )}
        <div className="grid gap-2">
          <input
            type="file"
            name={fileName}
            accept={accept}
            className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-lime file:px-4 file:py-2 file:font-bold file:text-ink"
          />
          {current && (
            <label className="flex items-center gap-2 text-xs text-muted">
              <input type="checkbox" name={removeName} value="on" className="accent-lime" /> Remover imagem atual
            </label>
          )}
          <input type="hidden" name={currentName} value={current ?? ""} />
        </div>
      </div>
      {help && !error && <span className={hint}>{help}</span>}
      {error && <span className={errorText}>{error}</span>}
    </div>
  );
}

/** Galeria: lista as imagens atuais (com opção de remover) e aceita novas. */
export function GalleryInput({ current, error }: { current: string[]; error?: string }) {
  return (
    <div className="grid gap-3">
      <span className={label}>Galeria de imagens</span>
      {current.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {current.map((url) => (
            <li key={url} className="grid gap-2 rounded-[10px] border border-line p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- prévia do Storage */}
              <img src={url} alt="" className="aspect-video w-full rounded-md object-cover" />
              <label className="flex items-center gap-2 text-xs text-muted">
                <input type="checkbox" name="galleryRemove" value={url} className="accent-lime" /> Remover
              </label>
              <input type="hidden" name="galleryCurrent" value={url} />
            </li>
          ))}
        </ul>
      )}
      <input
        type="file"
        name="galleryFiles"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-lime file:px-4 file:py-2 file:font-bold file:text-ink"
      />
      <span className={hint}>Até 30 imagens por projeto, 5 MB cada (JPG, PNG, WebP ou AVIF).</span>
      {error && <span className={errorText}>{error}</span>}
    </div>
  );
}

export function Checkbox({ name, label: text, defaultChecked, help }: { name: string; label: string; defaultChecked?: boolean; help?: string }) {
  return (
    <label className="flex items-start gap-3 rounded-[10px] border border-line bg-ink-2 p-4">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-lime" />
      <span className="grid gap-1">
        <span className="text-sm font-semibold">{text}</span>
        {help && <span className={hint}>{help}</span>}
      </span>
    </label>
  );
}
