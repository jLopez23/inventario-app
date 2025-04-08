# Lineamientos para Pruebas Unitarias en React Native con Jest, React Native Testing Library (v12.4+) y TypeScript Estricto

- Responde siempre en español
- El código siempre debe de estar en inglés

## 1. Propósito

Estos lineamientos definen las mejores prácticas para escribir pruebas unitarias robustas, mantenibles y claras para componentes de React Native utilizando Jest y React Native Testing Library (RNTL), con un enfoque estricto en TypeScript. El objetivo es asegurar la calidad del código y facilitar la detección temprana de errores.

## 2. TypeScript Estricto

- **Priorizar Tipado Explícito:** Define tipos claros y específicos para props, estados, variables y funciones dentro de las pruebas.
- **`Evitar any:`** El uso de `any` está estrictamente desaconsejado. Invalida los beneficios de TypeScript y puede ocultar errores potenciales.
- **`Uso de unknown:`** Si un tipo no se conoce con certeza, prefiere `unknown` sobre `any`. Realiza las validaciones de tipo necesarias antes de usar la variable.
- **Tipos Utilitarios:** Aprovecha los tipos utilitarios de TypeScript (`Partial`, `Required`, `Readonly`, etc.) y los tipos proporcionados por React Native Testing Library para mejorar la precisión del tipado.
- **Interfaces y Tipos:** Define interfaces o tipos para los mocks de datos o servicios complejos utilizados en las pruebas.

## 3. Herramientas Estándar

> **IMPORTANTE**: Anteriormente se recomendaba `@testing-library/jest-native`, pero este paquete está obsoleto y ya no se mantiene activamente. En su lugar, se debe utilizar React Native Testing Library v12.4 o posterior, que incluye los matchers de Jest integrados necesarios para las pruebas.

### 3.1 Migración a matchers integrados

Si tu proyecto utiliza `@testing-library/jest-native`, considera seguir estos pasos para migrar:

1. **Migración gradual**: Puedes usar los matchers integrados junto con los legacy matchers modificando tu archivo `jest-setup.js`:

   ```javascript
   // Usar esto:
   import "@testing-library/jest-native/extend-expect";

   // O bien esto para legacy matchers:
   import "@testing-library/jest-native/legacy-extend-expect";
   ```

2. **Matchers que no requieren cambios**:

   - `toBeDisabled()`
   - `toBeEnabled()`
   - `toBeEmpty()`
   - `toBeVisible()`
   - `toContainElement()`
   - `toHaveAccessibilityValue()`
   - `toHaveDisplayValue()`
   - `toHaveProp()`
   - `toHaveStyle()`
   - `toHaveTextContent()`

3. **Matchers reemplazados**:
   - `toHaveAccessibilityState()` ha sido reemplazado por:
     - Estado habilitado: `toBeEnabled()` / `toBeDisabled()`
     - Estado checked: `toBeChecked()` / `toBePartiallyChecked()`
     - Estado selected: `toBeSelected()`
     - Estado expanded: `toBeExpanded()` / `toBeCollapsed()`
     - Estado busy: `toBeBusy()`

- **Jest:** Utilízalo como el corredor de pruebas, marco de aserciones y para la creación de mocks/spies.
- **React Native Testing Library (RNTL) v12.4+:** Empléala para renderizar componentes y consultar/interactuar con elementos nativos de la manera en que lo haría un usuario. Enfócate en probar el comportamiento observable, no los detalles de implementación. Esta versión incluye matchers personalizados integrados, por lo que no es necesario instalar bibliotecas adicionales.

## 4. Patrón AAA (Arrange, Act, Assert)

Aplica rigurosamente el patrón AAA para estructurar cada caso de prueba. Usa comentarios para delimitar claramente cada sección.

- **Arrange (Organizar):**
  - Prepara todo lo necesario para la prueba: renderiza el componente con props específicas, configura mocks de funciones o módulos, define datos de prueba.
  - **Variables de Entrada:** Define las variables que se usarán para configurar el componente o la interacción (e.j., `initialProps`, `mockUserData`).
  - **`Variables Esperadas (expected):`** Define _explícitamente_ las variables que contienen los valores o estados _esperados_ como resultado de la acción. Nómbralas de forma clara (e.j., `expectedText`, `expectedCalls`). **Estas variables son distintas de las usadas directamente en la sección Act y son las únicas que deben usarse en la sección Assert**.
  - Ejemplo de nombres: `const initialCounter = 0; const expectedCounterAfterIncrement = 1;`
- **Act (Actuar):**
  - Ejecuta la acción o evento que desencadena el comportamiento a probar. Esto suele ser una interacción del usuario simulada (press, cambio de input) o la ejecución de una función.
  - Esta sección debe ser lo más concisa posible, idealmente una sola línea de código que simule la interacción principal.
  - Usa las variables de _entrada_ definidas en `Arrange`.
- **Assert (Afirmar):**
  - Verifica que el resultado de la acción (`Act`) coincide con lo esperado.
  - Realiza aserciones utilizando las funciones de Jest (`expect`) y los matchers integrados en React Native Testing Library.
  - **`Usa exclusivamente las variables expected definidas en la sección Arrange para las comparaciones.`** No reutilices las variables de entrada o las referencias directas obtenidas en `Act` (a menos que la aserción sea sobre la existencia de un elemento obtenido en `Act`).
  - Ejemplo: `expect(getByText(expectedText)).toBeTruthy(); expect(mockFunction).toHaveBeenCalledWith(expectedArgument);`

```typescript
// Ejemplo Estructural (Conceptual)

import { render, fireEvent } from "@testing-library/react-native";
import MiComponente from "./MiComponente";

describe("MiComponente", () => {
  it("debería mostrar el texto correcto después de presionar", () => {
    // Arrange
    const initialText = "Texto Inicial";
    const expectedTextAfterPress = "Texto Actualizado"; // Variable 'expected'
    const mockOnPress = jest.fn();

    // Renderizar y obtener elementos necesarios ANTES de la acción
    const { getByText, getByTestId } = render(
      <MiComponente initialText={initialText} onPress={mockOnPress} />
    );
    const button = getByTestId("update-button"); // Elemento para Act

    // Act
    fireEvent.press(button);

    // Assert
    // Usar 'expectedTextAfterPress' para la aserción
    const actualText = getByText(expectedTextAfterPress); // Elemento para Assert
    expect(actualText).toBeTruthy(); // Usando los matchers integrados en RNTL
    expect(mockOnPress).toHaveBeenCalledTimes(1);
    // No hacer: expect(getByText('Texto Actualizado')).toBeTruthy();
  });
});
```

## 5. Cobertura de Pruebas: Casos de Borde y Esquina

- **Camino Feliz:** Asegúrate de probar el flujo principal y esperado del componente.
- **Casos de Error:** Prueba cómo reacciona el componente ante entradas inválidas, errores de API (simulados con mocks), o estados inesperados.
- **Valores Límite (Borde):** Prueba con valores en los límites de lo esperado (e.j., listas vacías, listas con un solo elemento, números cero, negativos, máximos permitidos).
- **Casos Esquina:** Considera combinaciones de diferentes entradas o estados que podrían llevar a comportamientos inesperados.
- **Estados del Componente:** Prueba los diferentes estados visuales o lógicos que puede tener el componente (cargando, deshabilitado, con datos, sin datos, etc.).
- **Accesibilidad (a11y):** Aunque no es estrictamente unitario, asegúrate de probar con selectores que tengan en cuenta la accesibilidad (`getByAccessibilityLabel`, `getByA11yHint`, etc.) para asegurar que los elementos importantes sean identificables.

## 6. Mocks y Spies

- Usa `jest.fn()` para crear funciones mock y espiar llamadas.
- Usa `jest.mock()` para mockear módulos completos (e.j., servicios API, hooks personalizados, módulos nativos). Asegúrate de que los mocks también respeten el tipado estricto.
- Para módulos nativos específicos de React Native, considera usar `jest.mock('react-native', () => { ... })` para mockear componentes o APIs nativas.

## 7. Pruebas de Escenarios Comunes Avanzados

Esta sección aborda cómo aplicar los principios anteriores a escenarios más complejos.

## 7. Pruebas con matchers específicos

Antes de entrar en escenarios avanzados, es importante conocer los principales matchers disponibles para las pruebas en React Native.

### 7.1 Comprobación de existencia de elementos

```typescript
// Verifica si un elemento está presente en el documento
expect(getByText("Texto de ejemplo")).toBeTruthy();

// Verifica si un elemento NO está presente en el documento
expect(queryByText("Texto inexistente")).toBeNull();
```

### 7.2 Comprobación de contenido textual

```typescript
// Verifica si un elemento contiene determinado texto
expect(getByTestId("greeting")).toHaveTextContent("Hola, Mundo");

// Verifica propiedades de elementos
expect(getByTestId("input")).toHaveProp("placeholder", "Ingrese su nombre");
```

### 7.3 Comprobación de estado de elementos

```typescript
// Verifica si un elemento está habilitado o deshabilitado
expect(getByRole("button")).toBeEnabled();
expect(getByTestId("submit-button")).not.toBeDisabled();

// Verifica si un elemento está seleccionado
expect(getByTestId("checkbox")).toBeSelected();

// Verifica si un elemento está expandido o colapsado
expect(getByTestId("accordion")).toBeExpanded();
expect(getByTestId("dropdown")).toBeCollapsed();
```

### 7.4 Comprobación de estilos

```typescript
// Verifica si un elemento tiene determinado estilo
expect(getByTestId("header")).toHaveStyle({ fontSize: 18 });
```

## 8. Pruebas de Escenarios Avanzados

### 8.1 Pruebas Asíncronas

- **Objetivo:** Probar componentes que realizan operaciones asíncronas (e.g., llamadas API).
- **Técnica:** Usa `async/await` en la función de prueba y las utilidades `waitFor` o `findBy*` de RNTL en la sección `Assert` para esperar a que aparezcan elementos o estados dependientes de la operación asíncrona. Mockea las llamadas API (ver sección 6).
- **Ejemplo Conceptual:**

```typescript
import { render, waitFor } from "@testing-library/react-native";
import MiComponenteAsync from "./MiComponenteAsync";
import * as apiService from "./apiService"; // Módulo a mockear

// Mockear el servicio antes de las pruebas
jest.mock("./apiService");
const mockedFetchData = apiService.fetchData as jest.MockedFunction<
  typeof apiService.fetchData
>;

it("debería mostrar los datos después de la carga asíncrona", async () => {
  // Arrange
  const expectedDataText = "Datos Cargados";
  const mockApiResponse = { data: expectedDataText };
  // Configurar el mock para resolver con datos específicos
  mockedFetchData.mockResolvedValue(mockApiResponse);

  const { getByText, queryByTestId } = render(<MiComponenteAsync />);

  // Act
  // La acción puede ser implícita (carga al montar) o explícita (presionar botón)
  // Si es explícita, iría aquí. Si es implícita, esta sección puede estar vacía.

  // Assert
  // Esperar a que aparezca el elemento que depende de la data asíncrona
  await waitFor(() => expect(getByText(expectedDataText)).toBeTruthy());

  // O usar waitFor para aserciones más complejas
  await waitFor(() => {
    expect(queryByTestId("status")).toHaveTextContent("Cargado");
  });

  expect(mockedFetchData).toHaveBeenCalledTimes(1); // Verificar llamada al mock
});
```

### 8.2 Pruebas de Hooks Personalizados

- **Objetivo:** Probar la lógica encapsulada en hooks personalizados de forma aislada.
- **Técnica:** Usa la función `renderHook` de `@testing-library/react-hooks`. Aplica el patrón AAA: `Arrange` configura el estado inicial (si aplica), `Act` llama a funciones expuestas por el hook (usando `result.current`), y `Assert` verifica los valores retornados o efectos secundarios (usando `result.current` y `waitFor` si hay asincronía).
- **Ejemplo Conceptual:**

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import useCounter from "./useCounter"; // Hook personalizado

it("debería incrementar el contador", () => {
  // Arrange
  const initialCount = 0;
  const expectedCountAfterIncrement = 1;
  // Renderizar el hook
  const { result } = renderHook(() => useCounter(initialCount));

  // Act
  // Llamar a la función del hook usando act para envolver actualizaciones de estado
  act(() => {
    result.current.increment();
  });

  // Assert
  // Verificar el valor actual del estado del hook
  expect(result.current.count).toBe(expectedCountAfterIncrement);
});

it("debería actualizar el contador asíncronamente", async () => {
  // Arrange
  const initialCount = 0;
  const expectedCountAfterAsyncIncrement = 1;
  const { result } = renderHook(() => useCounter(initialCount));

  // Act
  await act(async () => {
    // Usar async act para operaciones asíncronas
    await result.current.incrementAsync();
  });

  // Assert
  expect(result.current.count).toBe(expectedCountAfterAsyncIncrement);
});
```

### 8.3 Pruebas con Context API

- **Objetivo:** Probar componentes que consumen valores de un Context de React.
- **Técnica:** En la sección `Arrange`, envuelve el componente bajo prueba con el `Context.Provider` correspondiente. Pasa un `value` mockeado (con tipado estricto) al Provider que simule el contexto necesario para la prueba. Realiza aserciones sobre cómo el componente renderiza o se comporta basado en ese contexto mockeado.
- **Ejemplo Conceptual:**

```typescript
import { render } from "@testing-library/react-native";
import { UserContext, User } from "./UserContext"; // Contexto y tipo
import ComponenteUsuario from "./ComponenteUsuario"; // Componente que consume el contexto

it("debería mostrar el nombre del usuario del contexto", () => {
  // Arrange
  const mockUser: User = { id: "1", name: "Usuario Mock" }; // Tipado estricto
  const expectedGreeting = `Hola, ${mockUser.name}`;

  // Envolver el componente con el Provider y el valor mockeado
  const { getByText } = render(
    <UserContext.Provider value={mockUser}>
      <ComponenteUsuario />
    </UserContext.Provider>
  );

  // Act
  // Generalmente no hay acción explícita si solo se prueba el renderizado inicial basado en contexto.

  // Assert
  expect(getByText(expectedGreeting)).toBeTruthy();
});
```

## 9. Navegación en React Native

- **Objetivo:** Probar componentes que interactúan con la navegación (react-navigation).
- **Técnica:** Mockea el módulo de navegación y las funciones de navegación. Verifica que se llaman con los parámetros correctos cuando se producen interacciones que deberían desencadenar navegación.
- **Ejemplo Conceptual:**

```typescript
import { render, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import PantallaDetalle from "./PantallaDetalle";

// Mockear el hook de navegación
jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(),
  };
});

it("debería navegar a la pantalla de detalles al presionar el botón", () => {
  // Arrange
  const mockNavigate = jest.fn();
  (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

  const itemId = "123";
  const expectedScreen = "DetalleItem";
  const expectedParams = { id: itemId };

  const { getByTestId } = render(<PantallaDetalle itemId={itemId} />);
  const detalleButton = getByTestId("detalle-button");

  // Act
  fireEvent.press(detalleButton);

  // Assert
  expect(mockNavigate).toHaveBeenCalledWith(expectedScreen, expectedParams);
});
```

## 10. Renderizado Condicional y Listas

- **Objetivo:** Probar componentes que renderizen contenido condicionalmente o presentan listas de elementos.
- **Técnica:** Prueba los diferentes estados (con datos, sin datos, cargando, etc.) y verifica que el contenido esperado se muestra en cada caso. Para listas, verifica que se renderiza el número correcto de elementos y que cada elemento tiene el contenido esperado.
- **Ejemplo Conceptual:**

```typescript
import { render } from "@testing-library/react-native";
import ListaElementos from "./ListaElementos";

describe("ListaElementos", () => {
  it("debería mostrar mensaje cuando la lista está vacía", () => {
    // Arrange
    const emptyItems: string[] = [];
    const expectedEmptyMessage = "No hay elementos disponibles";

    // Act
    const { getByText, queryAllByTestId } = render(
      <ListaElementos items={emptyItems} />
    );

    // Assert
    expect(getByText(expectedEmptyMessage)).toBeTruthy();
    expect(queryAllByTestId("item-element")).toHaveLength(0);
  });

  it("debería renderizar todos los elementos de la lista", () => {
    // Arrange
    const listItems = ["Item 1", "Item 2", "Item 3"];
    const expectedItemCount = listItems.length;

    // Act
    const { getAllByTestId } = render(<ListaElementos items={listItems} />);
    const renderedItems = getAllByTestId("item-element");

    // Assert
    expect(renderedItems).toHaveLength(expectedItemCount);
    listItems.forEach((item, index) => {
      expect(renderedItems[index]).toHaveTextContent(item);
    });
  });
});
```

## 11. Notas importantes sobre matchers específicos

Al trabajar con los matchers integrados en React Native Testing Library, es importante tener en cuenta lo siguiente:

1. **Compatibilidad con aria/accessibilityState**:

   - Los matchers como `toBeDisabled()` y `toBeEnabled()` revisan el estado de accesibilidad del elemento y sus ancestros.
   - `toBeChecked()` solo funciona en elementos con roles `checkbox`, `radio` y `switch`.
   - `toBePartiallyChecked()` solo funciona con elementos con rol `checkbox`.

2. **Aspectos adicionales**:
   - Algunos matchers soportan tanto `aria-*` como `accessibilityState` para mayor compatibilidad.
   - Para componentes personalizados, asegúrate de pasar correctamente las propiedades de accesibilidad para que los matchers funcionen como se espera.

## 12. Conclusión

Siguiendo estos lineamientos, se producirán pruebas unitarias para React Native que son:

- **Tipadas de forma segura:** Minimizando errores en tiempo de ejecución.
- **Claras y legibles:** Gracias a la estructura AAA bien definida.
- **Robustas:** Cubriendo diversos escenarios, incluidos casos de borde y esquina, y escenarios complejos.
- **Mantenibles:** Facilitando la refactorización y la comprensión del comportamiento esperado del componente.
- **Enfocadas en el usuario:** Al probar el comportamiento observable a través de RNTL.
- **Modernas y actualizadas:** Utilizando los matchers integrados de React Native Testing Library v12.4+.
