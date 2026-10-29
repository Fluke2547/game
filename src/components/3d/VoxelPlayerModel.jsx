const DEFAULT_SKIN = '#FFD1B3';
const DEFAULT_HAIR = '#3E2723';
const DEFAULT_SHIRT = '#4ECDC4';
const DEFAULT_PANTS = '#1A365D';
const DEFAULT_SHOE = '#2D3436';
import { DumbbellModel } from './office/FitnessZone';
import { globalPlayerState } from './Player';

export default function VoxelPlayerModel({
  custom = {},
  bodyRef,
  leftArmRef,
  rightArmRef,
  leftLegRef,
  rightLegRef,
  leftDumbbellRef,
  rightDumbbellRef,
}) {
  const skinColor = custom.skinTone || DEFAULT_SKIN;
  const hairColor = custom.hairColor || DEFAULT_HAIR;
  const shirtColor = custom.shirtColor || DEFAULT_SHIRT;
  const pantsColor = custom.pantsColor || DEFAULT_PANTS;
  const shoeColor = custom.shoeColor || DEFAULT_SHOE;

  return (
    <group ref={bodyRef} position={[0, 1.1, 0]}>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.45, 0.45, 0.45]} />
        <meshLambertMaterial color={skinColor} />
      </mesh>

      {custom.hairStyle === 'long' ? (
        <group>
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.47, 0.08, 0.47]} />
            <meshLambertMaterial color={hairColor} />
          </mesh>
          <mesh position={[0, 0.5, -0.2]} castShadow>
            <boxGeometry args={[0.47, 0.7, 0.1]} />
            <meshLambertMaterial color={hairColor} />
          </mesh>
          <mesh position={[-0.2, 0.5, 0]} castShadow>
            <boxGeometry args={[0.1, 0.7, 0.47]} />
            <meshLambertMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.2, 0.5, 0]} castShadow>
            <boxGeometry args={[0.1, 0.7, 0.47]} />
            <meshLambertMaterial color={hairColor} />
          </mesh>
        </group>
      ) : (
        <group>
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.47, 0.08, 0.47]} />
            <meshLambertMaterial color={hairColor} />
          </mesh>
          <mesh position={[0, 0.68, -0.2]} castShadow>
            <boxGeometry args={[0.47, 0.38, 0.1]} />
            <meshLambertMaterial color={hairColor} />
          </mesh>
        </group>
      )}

      <mesh position={[-0.1, 0.7, 0.23]}>
        <boxGeometry args={[0.06, custom.faceStyle === 'sharp' ? 0.045 : 0.06, 0.02]} />
        <meshLambertMaterial color="#2D3436" />
      </mesh>
      <mesh position={[0.1, 0.7, 0.23]}>
        <boxGeometry args={[0.06, custom.faceStyle === 'sharp' ? 0.045 : 0.06, 0.02]} />
        <meshLambertMaterial color="#2D3436" />
      </mesh>

      <group position={[0, 0.58, 0.23]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[custom.faceStyle === 'happy' ? 0.14 : 0.1, 0.02, 0.02]} />
          <meshLambertMaterial color="#2D3436" />
        </mesh>
        {custom.faceStyle !== 'sharp' && (
          <>
            <mesh position={[-0.04, 0.02, 0]}>
              <boxGeometry args={[0.02, 0.03, 0.02]} />
              <meshLambertMaterial color="#2D3436" />
            </mesh>
            <mesh position={[0.04, 0.02, 0]}>
              <boxGeometry args={[0.02, 0.03, 0.02]} />
              <meshLambertMaterial color="#2D3436" />
            </mesh>
          </>
        )}
      </group>

      {custom.accessory === 'glasses' && (
        <group position={[0, 0.7, 0.255]}>
          <mesh position={[-0.1, 0, 0]}>
            <boxGeometry args={[0.12, 0.018, 0.018]} />
            <meshLambertMaterial color="#2D3436" />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.12, 0.018, 0.018]} />
            <meshLambertMaterial color="#2D3436" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.014, 0.018]} />
            <meshLambertMaterial color="#2D3436" />
          </mesh>
        </group>
      )}

      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.55, 0.6, 0.35]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>

      {custom.accessory === 'badge' && (
        <mesh position={[0.17, 0.26, 0.19]} castShadow>
          <boxGeometry args={[0.1, 0.13, 0.025]} />
          <meshLambertMaterial color="#F4D076" />
        </mesh>
      )}

      <group ref={leftArmRef} position={[-0.4, 0.25, 0]}>
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[0.22, 0.2, 0.27]} />
          <meshLambertMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.18, 0.3, 0.22]} />
          <meshLambertMaterial color={skinColor} />
        </mesh>
        {leftDumbbellRef && (
          <group ref={leftDumbbellRef} visible={false} position={[0, -0.45, 0.1]} rotation={[Math.PI/2, 0, 0]}>
             <DumbbellModel size={globalPlayerState.isLifting === 'large' ? 'large' : 'small'} />
          </group>
        )}
      </group>

      <group ref={rightArmRef} position={[0.4, 0.25, 0]}>
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[0.22, 0.2, 0.27]} />
          <meshLambertMaterial color={shirtColor} />
        </mesh>
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.18, 0.3, 0.22]} />
          <meshLambertMaterial color={skinColor} />
        </mesh>
        {rightDumbbellRef && (
          <group ref={rightDumbbellRef} visible={false} position={[0, -0.45, 0.1]} rotation={[Math.PI/2, 0, 0]}>
             <DumbbellModel size={globalPlayerState.isLifting === 'large' ? 'large' : 'small'} />
          </group>
        )}
      </group>

      <group ref={leftLegRef} position={[-0.15, -0.15, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.23, 0.8, 0.26]} />
          <meshLambertMaterial color={pantsColor} />
        </mesh>
        <mesh position={[0, -0.875, 0.02]} castShadow>
          <boxGeometry args={[0.24, 0.15, 0.3]} />
          <meshLambertMaterial color={shoeColor} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.15, -0.15, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[0.23, 0.8, 0.26]} />
          <meshLambertMaterial color={pantsColor} />
        </mesh>
        <mesh position={[0, -0.875, 0.02]} castShadow>
          <boxGeometry args={[0.24, 0.15, 0.3]} />
          <meshLambertMaterial color={shoeColor} />
        </mesh>
      </group>
    </group>
  );
}
