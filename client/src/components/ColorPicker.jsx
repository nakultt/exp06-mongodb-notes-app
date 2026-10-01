export const COLORS = ["white", "yellow", "green", "blue", "pink", "purple"];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="colors">
      {COLORS.map((c) => (
        <button
          type="button"
          key={c}
          title={c}
          className={`swatch bg-${c} ${value === c ? "selected" : ""}`}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  );
}
