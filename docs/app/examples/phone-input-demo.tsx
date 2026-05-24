import { PhoneInput, PhoneInputCountrySelect, PhoneInputField } from 'kombase';

export default function PhoneInputDemo() {
  return (
    <div className="flex flex-col items-center w-full max-w-sm space-y-6 mx-auto">
      <PhoneInput>
        <PhoneInputCountrySelect />
        <PhoneInputField />
      </PhoneInput>
    </div>
  );
}
