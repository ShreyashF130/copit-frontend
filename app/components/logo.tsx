import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative h-10 w-40 flex items-center justify-center">
      
      <Image
        src="/logo-light.png"
        alt="CopIt Logo"
        width={400}
        height={114}
        priority 
        className="block dark:hidden object-contain"
    
        style={{ height: 'auto', width: 'auto', maxHeight: '100%' }}
      />

      <Image
        src="/logo-dark.png"
        alt="CopIt Logo"
        width={400}
        height={114}
        priority
        className="hidden dark:block object-contain"
        style={{ height: 'auto', width: 'auto', maxHeight: '100%' }}
      />
    </div>
  );
}