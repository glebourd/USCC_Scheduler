import {
    Calendar, Upload, Plus, TrendingUp, ThermometerSnowflake,
    CloudRain, Wind, CheckCircle, Truck, Settings, List,
    Zap, MapPin, Home, Wrench, X, Info, AlertTriangle,
    FileText, CheckSquare, Search, ExternalLink, Trash2, Loader2
} from 'lucide-react';

// Wrapper icon component to map names to actual lucide-react components
export const Icon = ({ name, ...props }) => {
    const icons = {
        calendar: Calendar,
        upload: Upload,
        plus: Plus,
        'trending-up': TrendingUp,
        'thermometer-snowflake': ThermometerSnowflake,
        'cloud-rain': CloudRain,
        wind: Wind,
        'check-circle': CheckCircle,
        truck: Truck,
        settings: Settings,
        list: List,
        zap: Zap,
        'map-pin': MapPin,
        home: Home,
        wrench: Wrench,
        x: X,
        info: Info,
        'alert-triangle': AlertTriangle,
        'file-text': FileText,
        'check-square': CheckSquare,
        search: Search,
        'external-link': ExternalLink,
        'trash-2': Trash2,
        'loader-2': Loader2,
    };

    const LucideIcon = Object.entries(icons).find(
        ([key]) => key.toLowerCase() === name.toLowerCase()
    )?.[1];

    if (!LucideIcon) return null;

    return <LucideIcon {...props} />;
};
