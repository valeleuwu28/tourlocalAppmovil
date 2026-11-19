import { NativeTabs } from "expo-router/native-tabs";

export default function MainTabsLayout() {
  return (
    <NativeTabs
      backgroundColor="#FFFFFF"
      indicatorColor="#CCFBF1"
      labelStyle={{ selected: { color: "#0F766E" } }}
    >
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Icon
          sf={{ default: "map", selected: "map.fill" }}
          md="explore"
        />
        <NativeTabs.Trigger.Label>Explorar</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="saved">
        <NativeTabs.Trigger.Icon
          sf={{ default: "bookmark", selected: "bookmark.fill" }}
          md="bookmark"
        />
        <NativeTabs.Trigger.Label>Guardados</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }}
          md="person"
        />
        <NativeTabs.Trigger.Label>Perfil</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
