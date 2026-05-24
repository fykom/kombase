import { AvatarGroup } from 'kombase';
import { Cloud, Compass, Flame, Leaf, Music, Rocket, ShieldCheck, Sparkles } from 'lucide-react';

const iconData = [
  { color: 'bg-cyan-500', icon: Rocket },
  { color: 'bg-pink-500', icon: Sparkles },
  { color: 'bg-lime-500', icon: Leaf },
  { color: 'bg-indigo-500', icon: Cloud },
  { color: 'bg-emerald-500', icon: ShieldCheck },
  { color: 'bg-amber-500', icon: Flame },
  { color: 'bg-rose-500', icon: Music },
  { color: 'bg-sky-500', icon: Compass },
];

export default function AvatarGroupIconsDemo() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Icon Group</h3>
        <AvatarGroup>
          {iconData.slice(0, 4).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                className={`flex size-10 items-center justify-center rounded-full text-white ${item.color}`}
                key={index}
              >
                <IconComponent size={16} />
              </div>
            );
          })}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Icon Group with Truncation</h3>
        <AvatarGroup max={3}>
          {iconData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                className={`flex size-10 items-center justify-center rounded-full text-white ${item.color}`}
                key={index}
              >
                <IconComponent size={16} />
              </div>
            );
          })}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Reverse Icon Group</h3>
        <AvatarGroup reverse>
          {iconData.slice(0, 4).map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                className={`flex size-10 items-center justify-center rounded-full text-white ${item.color}`}
                key={index}
              >
                <IconComponent size={16} />
              </div>
            );
          })}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Reverse with Truncation</h3>
        <AvatarGroup max={3} reverse>
          {iconData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                className={`flex size-10 items-center justify-center rounded-full text-white ${item.color}`}
                key={index}
              >
                <IconComponent size={16} />
              </div>
            );
          })}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Vertical Icon Group</h3>
        <div className="flex justify-center">
          <AvatarGroup orientation="vertical" size={32}>
            {iconData.slice(0, 4).map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-white ${item.color}`}
                  key={index}
                >
                  <IconComponent size={14} />
                </div>
              );
            })}
          </AvatarGroup>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Vertical Reverse Icon Group</h3>
        <div className="flex justify-center">
          <AvatarGroup orientation="vertical" reverse size={32}>
            {iconData.slice(0, 4).map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-white ${item.color}`}
                  key={index}
                >
                  <IconComponent size={14} />
                </div>
              );
            })}
          </AvatarGroup>
        </div>
      </div>
    </div>
  );
}
