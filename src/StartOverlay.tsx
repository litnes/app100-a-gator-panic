import "./Overlay.css";

type Props = {
  onStart: () => void;
};

export function StartOverlay({ onStart }: Props) {
  return (
    <div className="overlay-backdrop">
      <h2 className="overlay-title">わにわにパニック</h2>
      <p className="overlay-sub">
        ワニが出たら A / S / D / F / G キーで叩こう！<br />
        噛まれないように注意！
      </p>
      <button className="btn-start" onClick={onStart} autoFocus>
        スタート
      </button>
      <p className="overlay-sub" style={{ fontSize: "0.8rem", opacity: 0.7 }}>
        または Enter キー
      </p>
    </div>
  );
}
