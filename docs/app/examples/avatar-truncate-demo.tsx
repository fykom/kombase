import { AvatarGroup } from '@/components/avatar-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const avatars = [
  {
    fallback: 'CN',
    name: 'shadcn',
    src: 'https://i.pravatar.cc/150?img=12',
  },
  {
    fallback: 'EN',
    name: 'Ethan Niser',
    src: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    fallback: 'GR',
    name: 'Guillermo Rauch',
    src: 'https://i.pravatar.cc/150?img=45',
  },
  {
    fallback: 'LR',
    name: 'Lee Robinson',
    src: 'https://randomuser.me/api/portraits/men/76.jpg',
  },
  {
    fallback: 'ER',
    name: 'Evil Rabbit',
    src: 'https://i.pravatar.cc/150?img=58',
  },
  {
    fallback: 'TN',
    name: 'Tim Neutkens',
    src: 'https://randomuser.me/api/portraits/men/14.jpg',
  },
  {
    fallback: 'DO',
    name: 'Delba de Oliveira',
    src: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    fallback: 'SD',
    name: 'Shu Ding',
    src: 'https://i.pravatar.cc/150?img=23',
  },
];

export default function AvatarGroupTruncationDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Max 3 items</h3>
        <AvatarGroup max={3}>
          {avatars.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-sm">Max 5 items</h3>
        <AvatarGroup max={5}>
          {avatars.map((avatar, index) => (
            <Avatar key={index}>
              <AvatarImage src={avatar.src} />
              <AvatarFallback>{avatar.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
}
