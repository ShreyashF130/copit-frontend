import Image from "next/image";

export default function Onlylogo() {
  return (
    <div className="relative h-full w-auto flex items-center justify-center">
      <Image
        src="/Only_Logo2.png"
        alt="CopIt Logo"
        width={150} 
        height={150}
        priority 
        // object-contain ensures the whole logo shows.
        // w-auto h-full allows it to scale based on the parent's height naturally.
        className="object-contain h-full w-auto" 
      />
    </div>
  );
}