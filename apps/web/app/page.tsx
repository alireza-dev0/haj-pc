import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package } from 'lucide-react';
import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src'> & {
    srcLight: string;
    srcDark: string;
};

const ThemeImage = (props: Props) => {
    const { srcLight, srcDark, ...rest } = props;

    return (
        <>
            <Image {...rest} src={srcLight} className="imgLight" />
            <Image {...rest} src={srcDark} className="imgDark" />
        </>
    );
};

export default function Home() {
    return (
        <div className="w-full flex flex-col gap-3">
            <h1 className='text-3xl text-foreground'>
                کارت گرافیک RTX 5090
            </h1>
            <Input
                className="w-100"
                placeholder='ایمیل خود را وارد کنید'
            ></Input>
        </div>
    );
}
